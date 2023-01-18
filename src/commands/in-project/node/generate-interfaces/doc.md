[Mapping Mongoose Schema(s) to Interface(s)]

First we determine if we have more than 1 schema

If we have 1 schema we use the original code for generating an interface.

If we have more then 1 schema we use generate-interfaces-for-multi-schema

[generate-interfaces-for-multi-schema]
(This is a recursive loop until no more text is found)

First we find the main documents schema based on this convention:
"const compiledSchema = new Schema({"

We then cut out all the lines up until that point and grab the next terminator "})"

What gut cut out from the step above is the subdocument schema(s).
The algo to parse these out is to find the next starting schema
"const <something> = new Schema({"
We then grab the next terminator "})" and cut those lines out before continuing to parse.
