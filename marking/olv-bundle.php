<?php
// Sealed answer bundle reader, shared by every subject's marking/check.php (written by igcse_engine open-site).
// marking/bundle.sealed = "OLVSB1" || 24-byte nonce || sodium_crypto_secretbox(bundle.json, nonce, key).
// The key lives only in the subject's private config.php (outside public_html) as 'bundle_key' => base64 of 32 bytes.
// Any failure throws, so check.php answers with its usual clean 400 "not available". PHP 7.2+ (bundled ext-sodium).
declare(strict_types=1);

function olv_open_bundle(string $sealedPath, string $b64key): array {
    if (!function_exists('sodium_crypto_secretbox_open')) throw new RuntimeException('ext-sodium not loaded');
    $key = base64_decode($b64key, true);
    if ($key === false || strlen($key) !== SODIUM_CRYPTO_SECRETBOX_KEYBYTES) throw new RuntimeException('bundle key missing or malformed');
    $box = @file_get_contents($sealedPath);
    if ($box === false || strlen($box) < 6 + SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES
        || substr($box, 0, 6) !== 'OLVSB1') throw new RuntimeException('sealed bundle missing or not OLVSB1');
    $nonce = substr($box, 6, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $plain = sodium_crypto_secretbox_open(substr($box, 6 + SODIUM_CRYPTO_SECRETBOX_NONCEBYTES), $nonce, $key);
    if ($plain === false) throw new RuntimeException('bundle key does not open this bundle');
    $bundle = json_decode($plain, true);
    if (!is_array($bundle) || !isset($bundle['rules'])) throw new RuntimeException('bundle is not valid JSON with rules');
    return $bundle;
}
