import { useEffect, useMemo } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function ImageUploadField({ file, setImgUrl }) {
  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl]);

  const handleFile = (e) => {
    const f = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (f) { 
        console.log(f);

        setImgUrl(f) 
    };
  };

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderStyle: "dashed",
        borderColor: "divider",
        cursor: "pointer",
        textAlign: "center",
        transition: "0.15s",
        position: "relative",       
        "&:hover": {
          boxShadow: 3,
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent>
        <input
          accept="image/*"
          type="file"
          onChange={handleFile}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            cursor: "pointer",
          }}
        />

        {!file && (
          <Typography color="text.secondary">
            Click to upload an image with max size 2MB: jpeg, png or webp.
          </Typography>
        )}

        {file && (
          <Box
            component="img"
            src={previewUrl}
            alt="preview"
            sx={{
              maxWidth: "100%",
              maxHeight: 260,
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
