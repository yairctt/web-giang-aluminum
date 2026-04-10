import { Resend } from 'resend';
import formidable from 'formidable';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

// Disable the default Vercel/Next.js body parser to handle multipart/form-data properly
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable({
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB limit
            allowEmptyFiles: true,         // Allows submitting without a picture
            minFileSize: 0,
        });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ error: 'Error parsing form fields' });
            }

            // Extract fields (formidable v3 parses as arrays by default)
            const fullName = Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName || 'Not provided';
            const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone || 'Not provided';
            const email = Array.isArray(fields.email) ? fields.email[0] : fields.email || 'Not provided';
            const service = Array.isArray(fields.service) ? fields.service[0] : fields.service || 'Not provided';
            const details = Array.isArray(fields.details) ? fields.details[0] : fields.details || 'Not provided';

            // Prepare attachments array
            const attachments = [];
            let photoFile = Array.isArray(files.photo) ? files.photo[0] : files.photo;

            // Only attach if a real file with size was uploaded
            if (photoFile && photoFile.size > 0) {
                const fileBuffer = fs.readFileSync(photoFile.filepath);
                attachments.push({
                    filename: photoFile.originalFilename || 'uploaded_image.jpg',
                    content: fileBuffer,
                });
            }

            // Generate HTML content for the email
            const htmlContent = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #C9A33E; border-bottom: 2px solid #C9A33E; padding-bottom: 10px;">New Project Inquiry</h2>
                    <p><strong>Name:</strong> ${fullName}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Service Needed:</strong> ${service}</p>
                    <h3 style="margin-top: 20px;">Project Details:</h3>
                    <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${details}</p>
                </div>
            `;

            // Send via Resend
            const emailOptions = {
                from: 'Giang Aluminum Web <onboarding@resend.dev>', 
                // TEMPORARY TO: As a new Resend user, you can only send to yourself in Sandbox mode.
                // Replace this with 'info@giangaluminum.ca' later!
                to: ['a34660420@gmail.com'], 
                subject: `New Lead: ${service} - ${fullName}`,
                html: htmlContent,
                attachments: attachments,
            };

            if (email && email.includes('@')) {
                emailOptions.reply_to = email;
            }

            const { data, error } = await resend.emails.send(emailOptions);

            if (error) {
                console.error('Resend error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json({ success: true, data });
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
