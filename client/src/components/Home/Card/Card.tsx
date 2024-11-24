import {
  CardContent,
  Typography,
  CardActions,
  Card,
  Button,
  Badge,
} from "@mui/material";
import { IMediaCardProps } from "../../../interfaces/IMediaCard";
import { useNavigate } from "react-router-dom";

export default function MediaCard({
  title,
  shareText,
  learnMoreText,
  badgeContent,
  shareRoute,
  learnMoreRoute,
}: IMediaCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: "100%", position: "relative", overflow: "visible" }}>
      {badgeContent != null && (
        <Badge
          badgeContent={badgeContent}
          color="primary"
          // showZero
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
          }}
        />
      )}

      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Avatar src={avatarSrc} sizes="lg" />
        <AvatarGroup sx={{ display: "flex" }}>
          {avatarGroup.map((src, index) => (
            <Avatar key={index} src={src} />
          ))}
          <Avatar>+{avatarGroup.length}</Avatar>
        </AvatarGroup>
      </Box> */}

      <CardContent>
        <Typography gutterBottom component="div">
          {title}
        </Typography>
      </CardContent>

      <CardActions>
        {shareText && shareRoute && (
          <Button size="small" onClick={() => navigate(shareRoute)}>
            {shareText}
          </Button>
        )}
        {learnMoreText && learnMoreRoute && (
          <Button size="small" onClick={() => navigate(learnMoreRoute)}>
            {learnMoreText}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
