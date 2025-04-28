{{/*
Expand the name of the chart.
*/}}
{{- define "chatoverlay.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "chatoverlay.frontendName" -}}
{{- printf "%s-%s" .Chart.Name .Values.frontend.suffix | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "chatoverlay.backendName" -}}
{{- printf "%s-%s" .Chart.Name .Values.backend.suffix | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "chatoverlay.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "chatoverlay.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "chatoverlay.labels" -}}
helm.sh/chart: {{ include "chatoverlay.chart" . }}
{{ include "chatoverlay.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "chatoverlay.selectorLabels" -}}
app.kubernetes.io/name: {{ include "chatoverlay.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "chatoverlay.frontendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "chatoverlay.frontendName" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "chatoverlay.backendSelectorLabels" -}}
app.kubernetes.io/name: {{ include "chatoverlay.backendName" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "chatoverlay.frontendLabels" -}}
helm.sh/chart: {{ include "chatoverlay.chart" . }}
{{ include "chatoverlay.frontendSelectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "chatoverlay.backendLabels" -}}
helm.sh/chart: {{ include "chatoverlay.chart" . }}
{{ include "chatoverlay.backendSelectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}