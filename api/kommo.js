export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { username, password } = req.body;
    const token = process.env.KOMMO_API_TOKEN;
    const domain = process.env.KOMMO_DOMAIN;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        // Buscar contacto
        let searchRes = await fetch(`https://${domain}/api/v4/contacts?query=${username}`, {
            headers
        });

        let searchData = await searchRes.json();
        let contactId = null;

        if (searchData._embedded && searchData._embedded.contacts.length > 0) {
            contactId = searchData._embedded.contacts[0].id;
        } else {
            const createRes = await fetch(`https://${domain}/api/v4/contacts`, {
                method: 'POST',
                headers,
                body: JSON.stringify([
                    {
                        name: username,
                        custom_fields_values: [
                            {
                                field_code: "POSITION",
                                values: [{ value: password }]
                            }
                        ]
                    }
                ])
            });
            const createdData = await createRes.json();
            contactId = createdData._embedded.contacts[0].id;
        }

        // Crear lead vinculado
        const leadRes = await fetch(`https://${domain}/api/v4/leads`, {
            method: 'POST',
            headers,
            body: JSON.stringify([
                {
                    name: `Chat Web - ${username}`,
                    _embedded: {
                        contacts: [{ id: contactId }]
                    }
                }
            ])
        });

        const leadData = await leadRes.json();
        const leadId = leadData._embedded.leads[0].id;

        return res.status(200).json({
            success: true,
            message: 'Contacto y lead creados en Kommo',
            contactId,
            leadId
        });

    } catch (err) {
        console.error('Error al conectar con Kommo:', err);
        return res.status(500).json({ success: false, error: 'Error al conectar con Kommo' });
    }
}
