import {Rule} from "rc-field-form/lib/interface";

export const getYupRule = (schema: any): Rule => ({
    //@ts-ignore
    async validator({field}, value) {
        await schema.validateSyncAt(field, {[field]: value});
    }
})
