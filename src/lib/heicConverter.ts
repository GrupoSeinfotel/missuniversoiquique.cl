export const convertHeicToJpegIfNeeded = async (file: File): Promise<File> => {
    if (!file) return file;
    
    const isHeic = file.type === "image/heic" || 
                   file.type === "image/heif" || 
                   file.name.toLowerCase().endsWith(".heic") || 
                   file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
        try {
            const heic2any = (await import("heic2any")).default;
            const convertedBlob = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.8
            });
            
            const blobArray = Array.isArray(convertedBlob) ? convertedBlob : [convertedBlob];
            return new File(blobArray, file.name.replace(/\.heic$|\.heif$/i, ".jpg"), {
                type: "image/jpeg"
            });
        } catch (error) {
            console.error("Error converting HEIC image to JPEG:", error);
            // Fallback to original file
            return file;
        }
    }
    return file;
};
