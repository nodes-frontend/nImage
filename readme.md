### nImage module

##### n-image-options:

###### the following options can be used on each directive-instance

*   <pre>fallbackImage</pre>

    String or url

*   <pre>loadingTemplateUrl</pre>

    Let's you use a template as the loading "spinner"

*   <pre>loadingTemplate</pre>

    Let's you use a string or inline markup as the loading "spinner".

    NOTE: if **loadingTemplateUrl** is defined, this options is ignored.

*   <pre>disableLazy</pre>

    Disable lazy loading of images

*   <pre>nodesCDN</pre>

    If true the following attributes are attached to the image src url:

    <pre>width, height, mode[crop,resize,fit]</pre>

*   <pre>offest</pre>

    Amount of distance from the bottom of the scrollable container before image is loaded

##### n-image attributes

###### the following node-attributes can be used:

*   <pre>n-src</pre>

    The source of the image. The standard "src" attribute is not supported as this gives people a chance to inject malicious code

*   <pre>n-image-container</pre>

    If you are using lazyload, and the scroll happens inside a container (not the window), make sure to write the container selector in this attribute

    <pre>n-image-container="#container"</pre>

*   <pre>aspect-ratio</pre>

    If provided the image-container will be styled as an aspect-ratio container.

    The following aspect ratios are provided by default: 4-2, 2-1, 16-9, 3-2, 1-1, 4-3, 3-4, but feel welcome to add more (look in the scss for examples)

*   <pre>alt</pre>

    Just as you know it :-)