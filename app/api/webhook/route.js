import { NextResponse } from "next/server";
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { connectToDB } from "@/lib/db";
import { User } from "@/lib/models/User";

// Webhook secret from Clerk Dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Error occurred -- no svix headers" },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your webhook secret
    const wh = new Webhook(webhookSecret);

    let evt;

    // Verify the payload with the headers
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json(
        { error: "Error occurred" },
        { status: 400 }
      );
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);

      await connectToDB();

      // Create or update user in your database
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: primaryEmail?.email_address,
          firstName: first_name,
          lastName: last_name,
          fullName: `${first_name} ${last_name}`,
          imageUrl: image_url,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json(
      { error: "Error occurred" },
      { status: 500 }
    );
  }
} 