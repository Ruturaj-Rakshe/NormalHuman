import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const POST = async (req: Request) => {
    try {
        const data = await req.json();
        console.log("Clerk webhook received:", JSON.stringify(data, null, 2));

        // Correct extraction of user ID
        const id = data.data?.id || "";  // FIXED 
        const emailAddress = data.data?.email_addresses?.[0]?.email_address || "No Email Provided";
        const firstName = data.data?.first_name || "Unknown";
        const lastName = data.data?.last_name || "Unknown";
        const imageUrl = data.data?.image_url || "";

        // Ensure we have a valid user ID
        if (!id) {
            console.error(" Missing user ID in webhook data");
            return new Response("Bad Request: Missing user ID", { status: 400 });
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({ where: { id } });

        if (!existingUser) {
            await db.user.create({
                data: {
                    id,
                    emailAddress,
                    firstName,
                    lastName,
                    imageUrl,
                },
            });
            console.log("User created:", { id, emailAddress, firstName, lastName, imageUrl });
        } else {
            console.log(" User already exists, skipping creation.");
        }

        return new Response("Webhook received", { status: 200 });
    } catch (error) {
        console.error(" Error processing webhook:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
