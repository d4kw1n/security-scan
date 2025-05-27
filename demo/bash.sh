response=$(curl -s -f -u "ee0a15e99893b97c9e4b48d97912c664f8bea5ee:" "https://sonarcloud.io/api/issues/search?componentKeys=d4kw1n_security-scan&types=VULNERABILITY&statuses=OPEN,CONFIRMED,REOPENED&pullRequest=51")

comment="⚠️ **SonarCloud Analysis Report**\n\n"

vulnerabilities=$(echo "$response" | jq '.issues')
if [ "$(echo "$vulnerabilities" | jq length)" -gt 0 ] || [ "false" != "success" ]; then
  if [ "$(echo "$vulnerabilities" | jq length)" -gt 0 ]; then
    comment+="### Vulnerabilities Analysis by Perplexity\n"
    # Loop through each vulnerability
    echo "$vulnerabilities" | jq -r '.[] | @base64' | while read -r vuln_base64; do
      vuln=$(echo "$vuln_base64" | base64 --decode)
      rule=$(echo "$vuln" | jq -r '.rule')
      message=$(echo "$vuln" | jq -r '.message')
      severity=$(echo "$vuln" | jq -r '.severity')
      file=$(echo "$vuln" | jq -r '.component')
      line=$(echo "$vuln" | jq -r '.line // "N/A"')

      # Create JSON payload with escaped fields
      payload=$(jq -n \
        --arg rule "$rule" \
        --arg message "$message" \
        --arg severity "$severity" \
        --arg file "$file" \
        --arg line "$line" \
        '{model: "sonar-reasoning", messages: [{role: "user", content: "Analyze the following code vulnerability from SonarCloud and provide a detailed explanation, including why it is a security issue, potential impact, and recommended fixes:\n\n- Rule: \($rule)\n- Message: \($message)\n- Severity: \($severity)\n- File: \($file)\n- Line: \($line)"}]}')

      # Validate payload
      if ! echo "$payload" | jq . >/dev/null 2>&1; then
        echo "❌ Invalid JSON payload for vulnerability: $rule. Payload: $payload"
        comment+="\n- **$rule**: $message\n  - Severity: $severity, File: $file, Line: $line\n  - Analysis: Failed to create valid request for Perplexity.\n"
        continue
      fi

      # Log payload for debugging
      echo "Sending payload to Perplexity for vulnerability: $rule"
      echo "Payload: $payload"

      # Call Perplexity API
      api_response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer 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" \
        -H "Content-Type: application/json" \
        https://api.perplexity.ai/chat/completions \
        -d "$payload")
      
      # Split response and HTTP code
      http_code=$(echo "$api_response" | tail -n1)
      api_body=$(echo "$api_response" | sed '$d')

      # Log API response for debugging
      echo "Perplexity API response for vulnerability: $rule"
      echo "HTTP Code: $http_code"
      echo "Response Body: $api_body"

      if [ "$http_code" != "200" ]; then
        echo "❌ Failed to get Perplexity analysis for vulnerability: $rule. HTTP Code: $http_code, Response: $api_body"
        comment+="\n- **$rule**: $message\n  - Severity: $severity, File: $file, Line: $line\n  - Analysis: Failed to retrieve analysis from Perplexity (HTTP $http_code: $api_body).\n"
      else
        # Validate JSON response
        if ! echo "$api_body" | jq . >/dev/null 2>&1; then
          echo "❌ Invalid JSON response from Perplexity for vulnerability: $rule. Response: $api_body"
          comment+="\n- **$rule**: $message\n  - Severity: $severity, File: $file, Line: $line\n  - Analysis: Invalid response from Perplexity.\n"
        else
          # Extract Perplexity analysis
          analysis=$(echo "$api_body" | jq -r '.choices[0].message.content // ""')
          if [ -z "$analysis" ]; then
            echo "❌ Empty or missing analysis in Perplexity response for vulnerability: $rule. Response: $api_body"
            comment+="\n- **$rule**: $message\n  - Severity: $severity, File: $file, Line: $line\n  - Analysis: No analysis provided by Perplexity.\n"
          else
            clean_analysis=$(echo "$analysis" | sed '/<think>/,/<\/think>/d' | sed '/^$/N;/\n$/D')
            comment+="\n- **$rule**: $message\n  - Severity: $severity, File: $file, Line: $line\n  - Analysis:\n    $clean_analysis\n"
            echo -e "$comment" > comment.md
          fi
        fi
      fi
      # Add delay to avoid rate limiting
      sleep 1
    done
  else
    comment+="No vulnerabilities found, but Quality Gate failed due to other criteria (e.g., coverage).\n"
  fi
  comment+="\nPlease review and address these issues. See [SonarCloud Dashboard](https://sonarcloud.io/project/issues?id=d4kw1n_security-scan&pullRequest=51) for details."

  # Post comment to PR
  echo -e "$comment" >> comment.md
  # gh pr comment 51 --body-file comment.md
  exit 1 # Fail the workflow to block merge
else
  echo "✅ No vulnerabilities found and Quality Gate passed. PR can be merged."
  exit 0 # Success, allow mergeNo vulnerabilities found and Quality Gate passed. PR can be merged.
fi
