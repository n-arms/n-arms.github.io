for file in */*.bs.js; do
    sed 's|../../../../../../../../../../../usr/local/lib/node_modules|../../../..|' <$file >"${file}.bak"
    mv "${file}.bak" "$file"
done
