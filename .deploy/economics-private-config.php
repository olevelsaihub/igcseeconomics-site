<?php
// Economics 4EC1 private configuration (no secrets: open access needs no database, Firebase key or course ID).
// Live copy: /home/appsolevels/economics-private/config.php  (OUTSIDE public_html; mode 0600)
// The site finds it through .htaccess: SetEnv ECONOMICS_PRIVATE_CONFIG /home/appsolevels/economics-private/config.php
// The marking bundle (answer keys) lives beside it: /home/appsolevels/economics-private/economics-marking/bundle.json
// Open access (Bareera, 14 Oct 2026): anyone can open the site without signing in; teacher-only files are refused to all.
return [
    'origin' => 'https://apps.olevels.com',
    'base' => '/igcseeconomics/',
    'open_access' => true,
    'course_id' => 0,
];
