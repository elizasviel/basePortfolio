import { TokenInfo } from "../../types/tokens";

interface TokenSocialsProps {
  tokenInfo: TokenInfo;
}
export function TokenSocials({ tokenInfo }: TokenSocialsProps) {
  const { socials } = tokenInfo;
  if (!socials || Object.keys(socials).length === 0) {
    return null;
  }
  return (
    <div className="token-socials">
      <h3>Social Links</h3>
      <div className="social-links">
        {socials.twitter && (
          <a href={socials.twitter} target="blank" rel="noopener noreferrer">
            Twitter
          </a>
        )}
        {socials.telegram && (
          <a href={socials.telegram} target="blank" rel="noopener noreferrer">
            Telegram
          </a>
        )}
        {socials.discord && (
          <a href={socials.discord} target="blank" rel="noopener noreferrer">
            Discord
          </a>
        )}
      </div>
    </div>
  );
}
