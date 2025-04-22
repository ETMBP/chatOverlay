[CmdletBinding()]
param (
    [Parameter(Position=0)]
    [Alias("m")]
    [string]
    $Message,
    [Parameter(Position=1)]
    [Alias('t')]
    [string]
    $Tag
)

& git add --all
& git commit -m "$($Message)"
& git push
if ($Tag) {
    & git tag "$($Tag)"
    & git push origin "$($Tag)"
}