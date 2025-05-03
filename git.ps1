[CmdletBinding()]
param (
    [Parameter(Position=0)]
    [Alias("m")]
    [string]
    $Message,
    [Parameter(Position=1)]
    [Alias('t')]
    [string]
    $Tag,
    [Parameter(Position = 2, Mandatory=$true)]
    [Alias('b')]
    [string]
    $Branch
)

& git add --all
& git commit -m "$($Message)"
& git push origin $Branch
if ($Tag) {
    & git tag "$($Tag)"
    & git push origin "$($Tag)"
}