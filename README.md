# find-replace-multiple
Find replace multiple string in github action

## Example
  
    ```
      - name: Replace secrets value
        uses: htsnvhoang/find-replace-multiple@v3
        with:
          file: "config.yml"
          replaces: |
            {
              "parm2": "prod",
              "appsync_version": 145,
              "SECRET_STRIPE_WEBHOOK_CONNECT": "${{secrets.HTS_TEST}}",
              "GOOGLE_CREDENTIAL": ${{secrets.GOOGLE_CREDENTIAL}}
            }
    ```
