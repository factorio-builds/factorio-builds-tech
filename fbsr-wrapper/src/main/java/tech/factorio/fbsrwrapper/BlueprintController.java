package tech.factorio.fbsrwrapper;

import com.demod.fbsr.Blueprint;
import com.demod.fbsr.BlueprintStringData;
import com.demod.fbsr.FBSR;
import com.demod.fbsr.TaskReporting;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.stream.MemoryCacheImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("")
public class BlueprintController {

    @JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
    public static class RenderRequest {
        public String blueprint;
        public Boolean showInfoPanels;
        public Integer maxWidth;
        public Integer maxHeight;
        public Float quality;
    }

    @PostMapping
    public ResponseEntity<?> render(@RequestBody RenderRequest request) throws IOException {
        var options = new JSONObject();
        options.put("show-info-panels", request.showInfoPanels);
        options.put("max-width", request.maxWidth);
        options.put("max-height", request.maxHeight);

        var blueprint = new Blueprint(BlueprintStringData.decode(request.blueprint));
        var image = FBSR.renderBlueprint(blueprint, new TaskReporting(), options);
        var jpeg = convertToJpeg(image, (request.quality != null) ? request.quality : 1f);

        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(jpeg);
    }

    private byte[] convertToJpeg(BufferedImage image, float quality) throws IOException {
        var jpgWriter = ImageIO.getImageWritersByFormatName("jpg").next();
        var jpgWriteParam = jpgWriter.getDefaultWriteParam();
        jpgWriteParam.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        jpgWriteParam.setCompressionQuality(quality);

        var output = new ByteArrayOutputStream();
        jpgWriter.setOutput(new MemoryCacheImageOutputStream(output));

        var outputImage = new IIOImage(image, null, null);
        jpgWriter.write(null, outputImage, jpgWriteParam);

        return output.toByteArray();
    }

}
