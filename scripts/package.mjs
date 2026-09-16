import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
execFileSync(process.execPath, ['scripts/check.mjs'], { stdio: 'inherit' });
const version = JSON.parse(fs.readFileSync('package.json')).version;
fs.mkdirSync('dist', { recursive: true });
// Python standard library keeps packaging dependency-free and ZIP paths explicit.
execFileSync('python3', ['-c', `
import pathlib,zipfile
root=pathlib.Path.cwd()
for name,base,paths in [
 ('tubequiet-${version}.zip',root/'extension',(root/'extension').rglob('*')),
 ('tubequiet-${version}-source.zip',root,root.rglob('*'))]:
 with zipfile.ZipFile(root/'dist'/name,'w',zipfile.ZIP_DEFLATED) as out:
  for p in sorted(paths):
   rel=p.relative_to(base)
   if not p.is_file() or any(x in rel.parts for x in ['.git','dist','node_modules','work','.DS_Store','_metadata']):continue
   if p.name.startswith('.env'):continue
   info=zipfile.ZipInfo(rel.as_posix(),date_time=(2026,9,17,0,0,0)); info.compress_type=zipfile.ZIP_DEFLATED; info.external_attr=0o644<<16
   out.writestr(info,p.read_bytes())
`]);
const archives = [`tubequiet-${version}.zip`, `tubequiet-${version}-source.zip`];
fs.writeFileSync('dist/SHA256SUMS', archives.map(name => `${createHash('sha256').update(fs.readFileSync(path.join('dist', name))).digest('hex')}  ${name}`).join('\n') + '\n');
console.log('Created store ZIP, corresponding source ZIP and SHA256SUMS in dist/.');
