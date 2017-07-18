import os
import ast

directory = os.path.dirname(os.path.realpath(__file__))

out = {}
for filename in os.listdir(directory):
    if not (filename.endswith(".py") or filename.endswith(".json")) : 
        fullPath = os.path.join(directory, filename)
        relPath = os.path.join(*fullPath.split(os.sep)[6:])
        filename = relPath.split(os.sep)[-1]

        properties = {
        "path": relPath, 
        "function": filename[:filename.rfind('.')] #default function is filename (without path)
        }
        jsonprops = '{}'
        try:
            propfilename = filename[:filename.rfind('.')] + '.json'
            jsonprops = open(os.path.join(directory, propfilename), 'r+t').read()
        except:
            pass

        properties.update(ast.literal_eval(jsonprops))
        out.update({filename:properties})

out = str(out)
out = out.replace("'", '"')
out = out.replace('{', '{\n')
out = out.replace('}', '\n}')
out = out.replace('},', '},\n')
out = out.replace(',', ',\n')

print(out);
open(os.path.join(directory, 'listing.json'), 'w+t').write(out)