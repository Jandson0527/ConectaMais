param(
    [int]$Port = 8080
)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
    ".eot"  = "application/vnd.ms-fontobject"
}

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location.Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "=========================================" -ForegroundColor Cyan
    Write-Host " Servidor local iniciado com sucesso!   " -ForegroundColor Green
    Write-Host " Acesse no navegador: http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host " Raiz do servidor: $root" -ForegroundColor Gray
    Write-Host " Pressione Ctrl+C para encerrar.        " -ForegroundColor DarkGray
    Write-Host "=========================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath
            $relPath = $urlPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($relPath)) {
                $relPath = "index.html"
            }

            # Decodificar URL e converter separadores
            $relPath = [System.Uri]::UnescapeDataString($relPath)
            $relPath = $relPath -replace '/', [System.IO.Path]::DirectorySeparatorChar
            $filePath = [System.IO.Path]::Combine($root, $relPath)

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.LongLength
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache")
                $response.StatusCode = 200

                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $msg.LongLength
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
            $response.OutputStream.Close()
        }
        catch {
            Write-Warning "Erro ao processar requisicao: $_"
            try { $response.OutputStream.Close() } catch {}
        }
    }
}
catch {
    Write-Error $_
}
finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
