# LLD_patterns

Low-level design patterns implemented in TypeScript and Python, with design notes and interview guidance.

## Get the PR #2 changes locally

The Python pattern suite, root `package.json`, and GitHub Actions workflow are on the feature branch until PR #2 is merged.

```powershell
git fetch origin
git switch feat/python-lld-patterns-suite
git pull
```

If the branch does not exist locally yet:

```powershell
git switch --track origin/feat/python-lld-patterns-suite
```

Confirm you are on the feature branch and that the root package file is present:

```powershell
git branch --show-current
Test-Path .\package.json
```

## Run Python tests (Windows PowerShell)

Use Python 3.12 for parity with CI. Python 3.14 may also work, but is newer than the CI runtime.

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r Python/requirements-dev.txt --index-url https://pypi.org/simple
```

Run every Python pattern's tests separately (isolation avoids module-name collisions):

```powershell
$testDirs = Get-ChildItem .\Python -Directory | Where-Object { Test-Path (Join-Path $_.FullName 'tests') }
if (-not $testDirs) { throw 'No Python test suites found.' }
foreach ($dir in $testDirs) {
    Write-Host "`n=== Testing $($dir.Name) ===" -ForegroundColor Cyan
    Push-Location $dir.FullName
    try {
        python -m pytest tests -v
        if ($LASTEXITCODE -ne 0) { throw "Tests failed in $($dir.Name)" }
    }
    finally {
        Pop-Location
    }
}
```

To run one pattern, for example:

```powershell
Push-Location .\Python\rate-limiter
python -m pytest tests -v
Pop-Location
```

## Run TypeScript tests

Run these commands from the repository root on the feature branch (where `package.json` exists):

```powershell
npm install
npm test
```

## GitHub Actions

The CI workflow runs Python pattern suites independently and runs the TypeScript Jest suite on pull requests to `main` and pushes to `main` or the feature branch.

Workflow: [Actions](https://github.com/luckyhegde6/LLD_patterns/actions)
