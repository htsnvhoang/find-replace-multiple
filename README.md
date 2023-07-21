# find-replace-multiple
Find replace multiple string in github action

## Example
- Input "params" format is object with 2 keys: `finds`, `replaces`
  
    ```
      - name: Replace secrets value
        uses: htsnvhoang/find-replace-multiple@v2
        with:
          filePattern: "*.yml"
          params: |
            {
              "finds": [
                "secrets._a", 
                "secrets._b_"
              ],
              "replaces": [
                "val_1", 
                "${{secrets.TEST}}"
              ]
            }
    ```
