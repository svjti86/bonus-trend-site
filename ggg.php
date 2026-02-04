<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
error_reporting(0);


$in = json_decode(file_get_contents('php://input'), true);

$templateId = (int)($in['template_id'] ?? 0);
$locales    = $in['locales'] ?? [];
$vars       = $in['variables'] ?? [];
$skip       = $in['skip_keys'] ?? [];
$subjectRaw = $in['subject'] ?? '';

if (!$templateId || !$locales || !$vars) {
    http_response_code(400);
    echo json_encode(['error'=>'invalid input']);
    exit;
}

require_once __DIR__.'/../config/database.php';
$conn = (new Database())->getConnection();

// Твой список локалей — ничего лишнего
$cc2lang = [
 'ALL' => 'en',
        'NL'  => 'nl',
        'PT'  => 'pt',
        'DE'  => 'de',
        'PL'  => 'pl',
        'CZ'  => 'cs',
        'NO'  => 'nb',
        'FI'  => 'fi',
        'SK'  => 'sk',
        'HU'  => 'hu',
        'SE'  => 'sv',
        'DK'  => 'da',
        'IT'  => 'it',
        'AT'  => 'de-AT',
        'CH'  => 'de-CH',
        'BG'  => 'bg',
        'ES'  => 'es',
        'TR'  => 'tr',
        'FR'  => 'fr',
        'BE'  => 'nl-BE',
        'AU'  => 'en-AU',
        'CA'  => 'en',
        'GR'  => 'el',
        'NZ'  => 'en-NZ',
        'GB'  => 'en-GB',
        'US'  => 'en',
        'IE'  => 'en-IE',
        'KZ'  => 'ru',
        'ID'  => 'id',
        'IN'  => 'hi',
        'ZA'  => 'en-ZA',
        'QA'  => 'ar',
        'KW'  => 'ar',
        'AE'  => 'ar',
        'SA'  => 'ar',
        'BR'  => 'pt-BR',
        'RO'  => 'ro',
        'LK'  => 'si',
];

const OPENAI_KEY = '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';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function gpt($text, $lang, &$err) {
    if ($lang==='en') return $text;
    $payload = [
        'model' => 'gpt-4o-mini',
        'messages' => [['role'=>'user','content'=>"Translate to $lang. Return only the translation, no explanations or quotes:\n\n$text"]],
        'temperature' => 0.3, // ← точнее
    ];
    $ch = curl_init(OPENAI_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . OPENAI_KEY,
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 12,
    ]);
    $resp = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($resp === false) $err = 'curl '.curl_errno($ch).' '.curl_error($ch);
    curl_close($ch);
    if ($status === 200 && $resp) {
        $j = json_decode($resp, true);
        $translated = $j['choices'][0]['message']['content'] ?? $text;
        
        // ✅ Очистка от артефактов GPT
        $translated = trim($translated);
        $translated = trim($translated, '"\''); // убрать кавычки
        $translated = preg_replace('/^.*?->\s*/', '', $translated); // стрелки в начале
        $translated = preg_replace('/\s*->\s*".*?"$/', '', $translated); // стрелки в конце
        
        return $translated;
    }
    $err = "HTTP $status";
    return $text;
}

$html = $conn->query("SELECT html FROM template WHERE id=$templateId")->fetchColumn();
if (!$html){ http_response_code(404); echo json_encode(['error'=>'template not found']); exit; }

$usedIds=[]; $log=[];
foreach ($vars as $v){
    if(!isset($v['key'],$v['value'])) continue;
    $k = $v['key'];
    $val = $v['value'];
    $ph = '{'.$k.'}';
    if(in_array($k,$skip,true)){
        $html = str_replace($ph, $val, $html);
        continue;
    }
    if(isset($v['id'])) $usedIds[]=(int)$v['id'];

    $frag = '';
    foreach($locales as $cc){
        $lang = $cc2lang[$cc] ?? 'en';
        $err = '';
        $tr = gpt($val, $lang, $err);
        if($err) $log[] = "[$k/$cc] $err";
        $frag .= '{% if customer.country == "'.$cc.'" %}'.$tr.'{% else %}';
    }
    $frag .= $val . str_repeat('{% endif %}', count($locales));
    $html = str_replace($ph, $frag, $html);
}

$subject = '';
if($subjectRaw!==''){
    foreach($locales as $cc){
        $lang = $cc2lang[$cc] ?? 'en';
        $err = '';
        $tr = gpt($subjectRaw, $lang, $err);
        if($err) $log[] = "[subject/$cc] $err";
        $subject .= '{% if customer.country == "'.$cc.'" %}'.$tr.'{% else %}';
    }
    $subject .= $subjectRaw . str_repeat('{% endif %}', count($locales));
}

try {
    $conn->prepare('INSERT INTO mail_ready(template_id,subject,content,created_at) VALUES (?,?,?,NOW())')
         ->execute([$templateId, $subject, $html]);
} catch(PDOException $e){
    http_response_code(500);
    echo json_encode(['error'=>'DB insert failed','msg'=>$e->getMessage()]);
    exit;
}

if($usedIds){
    $in = implode(',',array_fill(0,count($usedIds),'?'));
    $conn->prepare("DELETE FROM generated_content WHERE id IN ($in)")->execute($usedIds);
}

echo json_encode([
    'status'=>'ok',
    'errors'=>$log
],JSON_UNESCAPED_UNICODE);
