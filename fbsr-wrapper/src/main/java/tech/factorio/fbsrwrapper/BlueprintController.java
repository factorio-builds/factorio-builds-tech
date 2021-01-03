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
import javax.imageio.stream.MemoryCacheImageOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;

@RestController
@RequestMapping("")
public class BlueprintController {

    @JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
    public static class RenderRequest {
        public String blueprint;
        public Boolean showInfoPanels;
        public Integer maxWidth;
        public Integer maxHeight;
    }

    @PostMapping
    public ResponseEntity<?> render(@RequestBody RenderRequest request, HttpServletResponse response) throws IOException {
        var options = new JSONObject();
        options.put("show-info-panels", request.showInfoPanels);
        options.put("max-width", request.maxWidth);
        options.put("max-height", request.maxHeight);

        var blueprint = new Blueprint(BlueprintStringData.decode(request.blueprint));
        var image = FBSR.renderBlueprint(blueprint, new TaskReporting(), options);
        writeImage(image, response.getOutputStream());

        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).build();
    }

    private void writeImage(BufferedImage image, OutputStream output) throws IOException {
        var outputImage = new IIOImage(image, null, null);
        var writer = ImageIO.getImageWritersByFormatName("png").next();
        writer.setOutput(new MemoryCacheImageOutputStream(output));
        writer.write(null, outputImage, writer.getDefaultWriteParam());
    }
}
