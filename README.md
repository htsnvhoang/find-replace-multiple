# find-replace-multiple
Find replace multiple string in github action

## Example
    ```
      - name: Replace secrets value
        uses: htsnvhoang/find-replace-multiple@v1
        with:
          finds: |
            secrets._a,
            secrets._b_
          replaces: |
            ${{ secrets.A }},
            ${{ secrets.B }}
          include: "config.yml"
    ```
