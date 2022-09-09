import { UserId } from '@app/crypto-finance/domain/value-object/user/user-id';

export class StoreLogCommand {
  public userId: UserId;
  public ip: string;
  public url: string;
  public browser: string;
  public query: string;
  public body: string;

  constructor(userId: UserId, url: string, browser: string, query: string, body: string, ip: string) {
    this.userId = userId;
    this.ip = ip;
    this.url = url;
    this.browser = browser;
    this.query = query;
    this.body = body;
  }
}
