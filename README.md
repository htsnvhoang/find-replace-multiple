# find-replace-multiple
Find replace multiple string in github action

## Example
- Input `separator` default is ","

    ```
      - name: Replace secrets value
        uses: htsnvhoang/find-replace-multiple@master
        with:
          finds: |
            secrets._a,
            secrets._b_
          replaces: |
            ${{ secrets.A }},
            ${{ secrets.B }}
          include: "config.yml"
    ```
