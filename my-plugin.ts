import {
  GraphQLSchema,
  DocumentNode,
  DefinitionNode,
  printSchema,
  parse,
  FieldDefinitionNode,
  TypeNode,
  EnumValueDefinitionNode
} from "graphql";

const assertNever = (impossible: never): never => {
  throw new Error(`Fuck ${impossible}`);
};

type Narrow<A, B> = A extends B ? A : never;

const stub = () => "Not implimented";


const baseType = (name: string) => {
  switch (name) {
    case "ID":
    case "String": return 't.string';
    case "Int": return 't.number';
    case "Boolean": return 't.boolean';
    default: return name;
  }
}

const foo = (
  node:
    | DefinitionNode
    | FieldDefinitionNode
    | TypeNode
): string => {
  switch (node.kind) {
    case "NonNullType":
      return foo(node.type);
    case "NamedType":
      return baseType(node.name.value);
    case "ListType":
      return `t.array(${foo(node.type)})`;
    case "FieldDefinition":
      return `${node.name.value}: ${foo(node.type)}`;
    case "ObjectTypeDefinition":
      return `
        type ${node.name.value} = t.TypeOf<typeof ${node.name.value}>
        const ${node.name.value} = t.type({
          ${(node.fields || []).map(foo).join(",\n")}
        })
      `;
    case "EnumTypeDefinition":
      return `
        type ${node.name.value} = t.TypeOf<typeof ${node.name.value}>
        const ${node.name.value} = t.keyof({
          ${(node.values || [])
            .map(entry => entry.name.value)
            .map(name => `${name}: null`)
            .join(",\n")}
        })
      `;
    case "DirectiveDefinition":
    case "EnumTypeExtension":
    case "FragmentDefinition":
    case "InputObjectTypeDefinition":
    case "InputObjectTypeExtension":
    case "InterfaceTypeDefinition":
    case "InterfaceTypeExtension":
    case "ObjectTypeExtension":
    case "OperationDefinition":
    case "ScalarTypeDefinition":
    case "ScalarTypeExtension":
    case "UnionTypeDefinition":
    case "UnionTypeExtension":
    case "SchemaDefinition":
    case "SchemaExtension":
      console.warn(`${node.kind} encountered but no implimentation found`);
      return "";
    default:
      return assertNever(node);
  }
};

interface Document {
  content: DocumentNode;
  filePath: string;
}

export const plugin = (
  schema: GraphQLSchema,
  documents: Document[]
): string => {
  const astNode = parse(printSchema(schema));

  return ["import * as t from 'io-ts'"]
    .concat(astNode.definitions.map(foo))
    .join("\n");
};
