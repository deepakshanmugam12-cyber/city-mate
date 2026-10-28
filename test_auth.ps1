Write-Host "================================================="
Write-Host "     CITYMATE HTTP Basic Auth Test Suite        "
Write-Host "================================================="

# Test 1: Public route
Write-Host "`n[Test 1] Public Route /api/health"
$r1 = Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/health" -Method Get -UseBasicParsing
Write-Host "Result: Status=$($r1.status), Version=$($r1.version), Auth=$($r1.authentication)"

# Test 2: Protected route without Auth (Expect 401)
Write-Host "`n[Test 2] Accessing Protected /profile without Credentials"
try {
    $r2 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/profile" -Method Get -UseBasicParsing
    Write-Host "ERROR: Expected 401 but got $($r2.StatusCode)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    $authHeader = $_.Exception.Response.Headers["WWW-Authenticate"]
    Write-Host "PASS: Received HTTP $code Unauthorized"
    Write-Host "Header: WWW-Authenticate = $authHeader"
}

# Test 3: Protected route with valid traveler credentials (Expect 200)
Write-Host "`n[Test 3] Accessing Protected /profile with traveler:traveler123"
$userBytes = [System.Text.Encoding]::UTF8.GetBytes("traveler:traveler123")
$userB64 = [System.Convert]::ToBase64String($userBytes)
$headers = @{ "Authorization" = "Basic $userB64" }
$r3 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/profile" -Headers $headers -UseBasicParsing
Write-Host "PASS: Received HTTP $($r3.StatusCode) OK"

# Test 4: Protected admin route with traveler credentials (Expect 403 Forbidden)
Write-Host "`n[Test 4] Accessing Admin /admin with traveler:traveler123"
try {
    $r4 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/admin" -Headers $headers -UseBasicParsing
    Write-Host "ERROR: Expected 403 but got $($r4.StatusCode)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Received HTTP $code Forbidden (Non-admin denied access)"
}

# Test 5: Protected admin route with admin:change-this-password (Expect 200)
Write-Host "`n[Test 5] Accessing Admin /admin with admin:change-this-password"
$adminBytes = [System.Text.Encoding]::UTF8.GetBytes("admin:change-this-password")
$adminB64 = [System.Convert]::ToBase64String($adminBytes)
$adminHeaders = @{ "Authorization" = "Basic $adminB64" }
$r5 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/admin" -Headers $adminHeaders -UseBasicParsing
Write-Host "PASS: Received HTTP $($r5.StatusCode) OK (Admin access granted)"

# Test 6: Protected route with invalid credentials (Expect 401)
Write-Host "`n[Test 6] Accessing with invalid credentials wronguser:wrongpass"
$badBytes = [System.Text.Encoding]::UTF8.GetBytes("wronguser:wrongpass")
$badB64 = [System.Convert]::ToBase64String($badBytes)
$badHeaders = @{ "Authorization" = "Basic $badB64" }
try {
    $r6 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/profile" -Headers $badHeaders -UseBasicParsing
    Write-Host "ERROR: Expected 401 but got $($r6.StatusCode)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Received HTTP $code Unauthorized for invalid credentials"
}

# Test 7: Protected API GET /api/favorites without credentials (Expect 401)
Write-Host "`n[Test 7] Accessing Protected API /api/favorites without credentials"
try {
    $r7 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/favorites" -UseBasicParsing
    Write-Host "ERROR: Expected 401 but got $($r7.StatusCode)"
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host "PASS: Received HTTP $code Unauthorized on Protected API"
}

# Test 8: Public Information Page /login-info (Expect 200)
Write-Host "`n[Test 8] Accessing Public Page /login-info"
$r8 = Invoke-WebRequest -Uri "http://127.0.0.1:5000/login-info" -Method Get -UseBasicParsing
Write-Host "PASS: Received HTTP $($r8.StatusCode) OK"

Write-Host "`n================================================="
Write-Host "      ALL HTTP BASIC AUTH TESTS PASSED!          "
Write-Host "================================================="
