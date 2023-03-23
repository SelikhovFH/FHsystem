import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET,
  AUTH0_MANAGEMENT_SERVICE_DOMAIN
} from "@config";
import { ManagementClient } from "auth0";
import { generate } from "generate-password";
import { UserRole } from "@interfaces/user.interface";

class Auth0Service {
  private management = new ManagementClient({
    domain: AUTH0_MANAGEMENT_SERVICE_DOMAIN,
    clientId: AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
    clientSecret: AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET
  });


  public async createUser({ dbId, role, email }: { email: string; dbId: string; role: UserRole }) {
    return this.management.createUser({
      email: email,
      password: generate({
        length: 10,
        numbers: true,
        symbols: true
      }),
      connection: "Username-Password-Authentication",
      user_metadata: { role, db_id: dbId },
      verify_email: false
    });
  }

  public async sendSignupInvitation(user_id: string) {
    return this.management.createPasswordChangeTicket({
      user_id,
      mark_email_as_verified: true,
      includeEmailInRedirect: true,
      client_id: AUTH0_CLIENT_ID
    });
  }

  public async deleteUser(id: string) {
    return this.management.deleteUser({ id });
  }

  public async assignPermissions(id: string, permissions: ("admin:admin" | "editor:editor")[]) {
    return this.management.assignPermissionsToUser(
      { id },
      {
        permissions: permissions.filter(Boolean).map(p => ({
          permission_name: p,
          resource_server_identifier: AUTH0_AUDIENCE
        }))
      }
    );
  }
}

export default Auth0Service;
