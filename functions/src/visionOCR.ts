import * as functions from 'firebase-functions';

async function getAccessToken() {
  // When running in GCP (Cloud Functions), the metadata server provides an
  // access token for the default service account.
  const mdUrl = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
  const resp = await fetch(mdUrl, { headers: { 'Metadata-Flavor': 'Google' } });
  if (!resp.ok) throw new Error('failed to obtain metadata token');
  const json = await resp.json();
  return json.access_token as string;
}

export async function analyzeImageHandler(data: any, context: any) {
  try {
    const imageBase64: string | undefined = data?.imageBase64;
    const imageUri: string | undefined = data?.imageUri;

    if (!imageBase64 && !imageUri) {
      return {
        items: [
          { name: 'Milk', quantity: 1, unit: 'ltr', raw: 'Milk 1 L' },
          { name: 'Spinach', quantity: 1, unit: 'bunch', raw: 'Spinach' },
        ],
      };
    }

    const requests: any[] = [];
    if (imageBase64) {
      requests.push({
        image: { content: imageBase64 },
        features: [{ type: 'TEXT_DETECTION' }],
      });
    } else if (imageUri) {
      requests.push({
        image: { source: { imageUri } },
        features: [{ type: 'TEXT_DETECTION' }],
      });
    }

    const token = await getAccessToken();

    const visionResp = await fetch('https://vision.googleapis.com/v1/images:annotate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });

    if (!visionResp.ok) {
      const txt = await visionResp.text();
      console.error('Vision API error', visionResp.status, txt);
      throw new functions.https.HttpsError('internal', 'Vision API error');
    }

    const j = await visionResp.json();
    const annotations = j?.responses?.[0]?.textAnnotations || [];
    const fullText = annotations[0]?.description || '';

    const lines = fullText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
    const unitCandidates = ['g','kg','mg','ml','l','ltr','litre','bunch','pack','pcs','piece','oz','lb','cup','tbsp','tsp','slice','slices'];

    const items = lines.map((line: string) => {
      let name = line;
      let quantity: number | undefined = undefined;
      let unit: string | undefined = undefined;

      const q1 = line.match(/^(?:([0-9]+(?:[.,][0-9]+)?)\s*)([a-zA-Z]+)?\s+(.+)$/);
      const q2 = line.match(/^(.+?)\s+([0-9]+(?:[.,][0-9]+)?)(?:\s*([a-zA-Z]+))?$/);

      if (q1) {
        const q = Number(String(q1[1]).replace(',', '.'));
        if (!isNaN(q)) quantity = q;
        if (q1[2] && unitCandidates.includes(q1[2].toLowerCase())) unit = q1[2];
        name = q1[3] || name;
      } else if (q2) {
        const q = Number(String(q2[2]).replace(',', '.'));
        if (!isNaN(q)) quantity = q;
        if (q2[3] && unitCandidates.includes(q2[3].toLowerCase())) unit = q2[3];
        name = q2[1] || name;
      }

      name = name.replace(/[^\w\s'-]/g, '').trim();

      return { name, quantity, unit, raw: line };
    }).filter((it: any) => it.name && it.name.length > 0);

    return { items };
  } catch (err) {
    console.error('analyzeImageHandler error', err);
    throw new functions.https.HttpsError('internal', 'OCR failed');
  }
}
