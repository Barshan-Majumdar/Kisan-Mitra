import base64
import io
import json
import urllib.request
from PIL import Image, ImageDraw

# Create a 224x224 test leaf image
img = Image.new('RGB', (224, 224), color=(250, 249, 245))
draw = ImageDraw.Draw(img)
# Draw leaf
draw.ellipse([30, 30, 194, 194], fill=(74, 124, 56))
# Draw lesion spots
draw.ellipse([80, 80, 130, 130], fill=(45, 30, 18))
draw.ellipse([90, 90, 120, 120], fill=(21, 13, 8))

buffer = io.BytesIO()
img.save(buffer, format='JPEG')
b64_str = 'data:image/jpeg;base64,' + base64.b64encode(buffer.getvalue()).decode('utf-8')

payload = json.dumps({
    'image': b64_str,
    'userEmail': 'demo@agriculture.com'
}).encode('utf-8')

print('🌿 Sending foliar test sample to http://localhost:3000/api/disease/predict...')
req = urllib.request.Request(
    'http://localhost:3000/api/disease/predict',
    data=payload,
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        print('Status:', resp.status)
        print('Crop:', res_data.get('crop'), '| Disease:', res_data.get('disease'))
        print('Confidence:', res_data.get('confidence'), '%')
        print('Chemical:', res_data.get('chemicalTreatment'))
        print('Organic:', res_data.get('organicTreatment'))
        print('Saved History ID:', res_data.get('historyId'))

        has_at_chem = '@' in str(res_data.get('chemicalTreatment', ''))
        has_at_org = '@' in str(res_data.get('organicTreatment', ''))

        if not has_at_chem and not has_at_org:
            print('🎉 SUCCESS: No "@" symbols detected in suggestions!')
        else:
            print('⚠️ WARNING: "@" still present in suggestions')

        # Now test GET /api/disease/history
        print('\n📜 Fetching history from http://localhost:3000/api/disease/history?userEmail=demo@agriculture.com...')
        hist_req = urllib.request.Request('http://localhost:3000/api/disease/history?userEmail=demo@agriculture.com')
        with urllib.request.urlopen(hist_req) as h_resp:
            h_data = json.loads(h_resp.read().decode('utf-8'))
            print('History Records Found:', len(h_data.get('history', [])))
            if h_data.get('history'):
                latest = h_data['history'][0]
                print(f'Latest Record: ID #{latest["id"]} | {latest["crop"]} - {latest["disease"]} ({latest["confidence"]}%)')
                print('🎉 SUCCESS: Disease Detection History is persistently stored and loaded!')
except Exception as e:
    print('Request error:', e)
