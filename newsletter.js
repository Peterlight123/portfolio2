export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const DATACENTER = MAILCHIMP_API_KEY.split('-')[1]; // e.g. us21

  try {
    const response = await fetch(`https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed'
      })
    });

    if (response.status >= 400) {
      const errorData = await response.json();
      return res.status(400).json({ error: errorData.detail || 'There was an error subscribing' });
    }

    return res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
