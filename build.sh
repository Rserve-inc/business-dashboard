git worktree add temp master
cd temp || exit
npm install
npm run build
# move all dist files to root, overwrite existing files
mv -f dist/* ../
rm -rf dist
