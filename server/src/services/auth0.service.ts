import {
  AUTH0_AUDIENCE,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
  AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET,
  AUTH0_MANAGEMENT_SERVICE_DOMAIN,
  CLIENT_URL
} from "@config";
import {ManagementClient, UpdateUserData} from "auth0";
import {generate} from "generate-password";

class Auth0Service {
  private management = new ManagementClient({
    domain: AUTH0_MANAGEMENT_SERVICE_DOMAIN,
    clientId: AUTH0_MANAGEMENT_SERVICE_CLIENT_ID,
    clientSecret: AUTH0_MANAGEMENT_SERVICE_CLIENT_SECRET,
  });

  constructor() {
  }

  public async createUser({dbId, isAdmin, email}: { email: string, isAdmin: boolean, dbId: string }) {
    return this.management.createUser({
      email: email,
      password: generate({
        length: 10,
        numbers: true,
        symbols: true
      }),
      connection: "Username-Password-Authentication",
      user_metadata: {is_admin: isAdmin, db_id: dbId},
      verify_email: false
    })
  }

  public async updateUser(id: string, data: UpdateUserData) {
    return this.management.updateUser({id}, {})
  }

  public async sendSignupInvitation(user_id: string) {
    return this.management.createPasswordChangeTicket({user_id, result_url: CLIENT_URL, mark_email_as_verified: true,})
  }

  public async assignAdminPermission(id: string) {
    return this.management.assignPermissionsToUser({id}, {
      permissions: [{
        permission_name: "admin:admin",
        resource_server_identifier: AUTH0_AUDIENCE,
      }]
    })
  }

  public async getUser(id: string) {
    return this.management.getUser({id})
  }

  public async getUsers(page: number, per_page: number) {
    return this.management.getUsers({page, per_page})
  }

}

export default Auth0Service;
