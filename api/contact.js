export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" })
  }

  try {
    /* Use Web3Forms free API to send email to farnazgh4444@gmail.com */
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY || "YOUR_WEB3FORMS_KEY",
        subject: `Portfolio Contact: ${name}`,
        from_name: name,
        email: email,
        message: message,
        to: "farnazgh4444@gmail.com",
      }),
    })

    const data = await response.json()

    if (data.success) {
      return res.status(200).json({ success: true })
    } else {
      return res.status(500).json({ error: "Failed to send message" })
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
