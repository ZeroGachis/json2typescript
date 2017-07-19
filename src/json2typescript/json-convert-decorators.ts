import { MappingOptions, Settings } from "./json-convert-options";

/**
 * Decorator of a class that is a custom converter.
 *
 * @param target the class
 */
export function JsonConverter(target: any) {
    target[Settings.MAPPER_PROPERTY] = "";
}

/**
 * Decorator of a class that comes from a JSON object.
 *
 * @param target the class
 */
export function JsonObject(target: any) {
    target[Settings.MAPPING_PROPERTY] = [];
}

/**
 * Decorator of a class property that comes from a JSON object.
 *
 * The second param can be either a type or a class of a custom converter.
 *
 * Use the following notation for the type:
 * - Primitive type: String|Number|Boolean
 * - Custom type: YourClassName
 * - Array type: [String|Number|Boolean|YourClassName]
 *
 * If you decide to use a custom converter, make sure this class implements the interface JsonCustomConvert from this package.
 *
 * @param jsonProperty the key in the expected JSON object
 * @param conversionOption optional param (default: undefined), should be either the expected type (String|Boolean|Number|etc) or a custom converter class implementing JsonCustomConvert
 * @param isOptional optional param (default: false), if true, the json property does not have to be present in the object
 *
 * @returns {(target:any, key:string)=>void}
 */
export function JsonProperty(jsonProperty: string, conversionOption?: any, isOptional?: boolean): any {

    return function (target: any, classProperty: string): void {

        if (typeof(target[Settings.MAPPING_PROPERTY]) === "undefined") {
            target[Settings.MAPPING_PROPERTY] = [];
        }

        if (typeof(isOptional) === "undefined") {
            isOptional = false;
        }

        let jsonPropertyMappingOptions = new MappingOptions();
        jsonPropertyMappingOptions.classProperty = classProperty;
        jsonPropertyMappingOptions.jsonProperty = jsonProperty;
        jsonPropertyMappingOptions.isOptional = isOptional ? isOptional : false;

        // Check if conversionOption is a type or a custom converter.
        if (typeof(conversionOption) !== "undefined" && typeof(conversionOption[Settings.MAPPER_PROPERTY]) !== "undefined") {
            jsonPropertyMappingOptions.customConverter = new conversionOption();
        } else {
            jsonPropertyMappingOptions.expectedType = conversionOption;
        }

        // Save the mapping info
        target[Settings.MAPPING_PROPERTY][classProperty] = jsonPropertyMappingOptions;

    }

}