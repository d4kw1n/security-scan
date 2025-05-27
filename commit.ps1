$random = Get-Random -Minimum 100000 -Maximum 999999
$date = Get-Date -Format "yyyy-MM-dd"

git checkout -b "feature/$date-$random"
git add contracts/* ./github/workflows/ci-pipeline.yml
git commit -m "ci: update ci-pipeline.yml"
git push origin "feature/$date-$random"