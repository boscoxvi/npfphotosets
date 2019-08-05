# npfPhotosets()
npfPhotosets() is a plugin for styling Tumblr photosets like the layout observed on the website's dashboard. It focuses on photosets created through NPF(Neue Post Format), Tumblr's new format, which allows you to create photoset's through the entire post body instead of only at the top of it when you're the original poster.

Notice that:
1. This plugin will not create photosets entirely made of rows with only one image as of now;
2. This plugin will not create a single lightbox when grouping images in a photoset, neither will images that do not natively include a lightbox feature receive it.
## Use case
Include both the JavaScript and the CSS file in your code, then call the function and it's parameters:
```
var npfOptions = {
   rowClass:"npf_row",
   imageContainerClass:"tmblr-full",
   generatedPhotosetContainerClass:"npf_photoset",
   imageClass:"npf_image",
   includeSingleRowImagesInPhotosets: true,
   insertGalleryIndicator: false,
   galleryIndicatorClass: "npf_gallery_indicator",
   galleryIndicatorContent: "<img src='image_url'>",
   photosetMargins:""
}

npfPhotosets("postSelector", npfOptions);
```
## Options
- `"postSelector"` is where the selector used for your posts goes, between quotes as suggested. It can be a mere HTML selector(like `“article”`), a class(`“.posts”`), or even an array-like list.
- `rowClass` is where the name of the class of Tumblr’s generated row wrappers should be inserted. There is no need to change this unless Tumblr changes its used class name.
- `imageContainerClass` is where the name of the class of Tumblr’s generated full-size image wrappers should be inserted. There is no need to change this unless Tumblr changes its used class name.
- `generatedPhotosetContainerClass` is where the name of the class to be assigned to the generated photoset wrappers should be inserted. It is presented by default as npf_photoset but if anyone feels the need to use a different class name, it should be changed here. Note that this allows only one class.
- `imageClass` is where the name of the class to be assigned to each photoset image should be inserted. It is presented by default as npf_image but if anyone feels the need to use a different class name, it should be changed here. Note that this allows only one class.
- `includeSingleRowImagesInPhotosets` should have either a true or false value. If true, this will allow images with the `imageContainerClass` that are not inserted into a proper row with images beside them be part of the generated photoset. The idea is to look similar to the Tumblr default photoset, where you can make photosets including rows with only one image. If you’d rather only have photosets made out of proper rows, change this to false. Note that even if this has a true value, photosets including only single image rows will not be generated.
- `insertGalleryIndicator` should have either a true or false value. If true, this will insert a div into each image container where you can put an indication that there is an image gallery with a lightbox link. If you’d rather have no indicator, change this to false.
- `galleryIndicatorClass` is where the name of the class to be assigned to each gallery indicator div should be inserted. It is presented by default as npf_gallery_indicator but if anyone feels the need to use a different class name, it should be changed here. Note that this allows only one class.
- `galleryIndicatorContent` is where you can insert content inside the gallery indicator div, such as text or an icon. The inserted `<img>` tag is merely an example.
- `photosetMargins` is where the value of the margins between photos inside the photosets should be inserted. The value is measured in pixels. If you want it to have no margins, insert a 0; in case you leave it empty(like two quotation marks with nothing in-between `“”`), it will automatically use an adaptable percentage based value for the margins. You should always keep the quotation marks, even in the no margins case.

The options `rowClass` and `imageContainerClass` are available for easy maintenance reasons.

Experimentally, there's also the `includeCommonPhotosets` option, whose value should be either true or false. This allows the plugin to create the row structure necessary as well as style photosets which were created in the traditional manner, as long as you make sure to use the same classes as the ones being assigned to the NPF-generated photosets, as well as adding to the photoset container the `data-layout` attribute with the `{PhotosetLayout}` value. It's not properly shown yet since there's still the question of using Tumblr's lightbox for them.
