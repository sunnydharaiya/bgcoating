$ports = @(7777, 3001, 3000)
$killed = 0

Write-Host "Checking ports: $($ports -join ', ')..." -ForegroundColor Yellow

foreach ($port in $ports) {
    try {
        $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($conns) {
            $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
            foreach ($procId in $pids) {
                if ($procId -gt 0) {
                    try {
                        $p = Get-Process -Id $procId -ErrorAction SilentlyContinue
                        $pName = if ($p) { $p.ProcessName } else { "Unknown" }
                        Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                        Write-Host "  [+] Freed port $port (terminated $pName, PID $procId)" -ForegroundColor Green
                        $killed++
                    } catch {
                        Write-Host "  [!] Could not stop PID ${procId}: $($_.Exception.Message)" -ForegroundColor Red
                    }
                }
            }
        } else {
            Write-Host "  [-] Port $port is not in use." -ForegroundColor DarkGray
        }
    } catch {
        Write-Host "  [!] Error checking port ${port}: $($_.Exception.Message)" -ForegroundColor DarkYellow
    }
}

if ($killed -eq 0) {
    Write-Host "`nAll ports were already free." -ForegroundColor Cyan
} else {
    Write-Host "`nSuccessfully terminated $killed process(es)." -ForegroundColor Green
}
