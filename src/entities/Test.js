import { EntitySchema } from 'typeorm';

//若使用ESM和JS配置实体类，由于装饰器支持问题，只能使用schema方式进行配置，无法使用装饰器方式
//若使用TS或者CJS则可以使用装饰器方式

const TestSchema = new EntitySchema({
    name: 'Test', // 实体名称
    tableName: 'Test', // 表名称
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        email: {
            type: 'varchar',
            unique: true,
        },
        value: {
            type: 'varchar',
        },
    },
});

export default TestSchema;