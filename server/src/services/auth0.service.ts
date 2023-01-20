import {
  AUTH0_AUDIENCE,
  AUTH0_ISSUER,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET,
  CLIENT_URL
} from "@config";
import {ManagementClient} from "auth0";

class Auth0Service {
  private management = new ManagementClient({
    domain: AUTH0_ISSUER,
    clientId: AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
    clientSecret: AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET,
  });

  public async createUser(email: string) {
    return this.management.createUser({email: email, connection: "Username-Password-Authentication"})
  }

  public async sendSignupInvitation(user_id: string) {
    return this.management.createPasswordChangeTicket({user_id, result_url: CLIENT_URL})
  }

  public async assignAdminPermission(id: string) {
    return this.management.assignPermissionsToUser({id}, {
      permissions: [{
        permission_name: "admin:admin",
        resource_server_identifier: AUTH0_AUDIENCE
      }]
    })
  }

}

export default Auth0Service;
