using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Layer2Aufgabe.Filters
{
    public class AddCustomerExampleValuesOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (context.ApiDescription.HttpMethod.Equals("POST", StringComparison.InvariantCultureIgnoreCase) &&
                context.MethodInfo.GetParameters().Any(p => p.ParameterType == typeof(Customer)))
            {
                if (operation.RequestBody != null && operation.RequestBody.Content.ContainsKey("application/json"))
                {
                    operation.RequestBody.Content["application/json"].Example = GetCustomerPostRequestExample();
                }
            }

            if (context.ApiDescription.HttpMethod.Equals("POST", StringComparison.InvariantCultureIgnoreCase) &&
                context.MethodInfo.GetParameters().Any(p => p.ParameterType == typeof(Project)))
            {
                if (operation.RequestBody != null && operation.RequestBody.Content.ContainsKey("application/json"))
                {
                    operation.RequestBody.Content["application/json"].Example = GetProjectRequestExample();
                }
            }

            if (context.ApiDescription.HttpMethod.Equals("PUT", StringComparison.InvariantCultureIgnoreCase) &&
                context.MethodInfo.GetParameters().Any(p => p.ParameterType == typeof(Project)))
            {
                if (operation.RequestBody != null && operation.RequestBody.Content.ContainsKey("application/json"))
                {
                    operation.RequestBody.Content["application/json"].Example = GetProjectRequestExample();
                }
            }

            if (context.ApiDescription.HttpMethod.Equals("PUT", StringComparison.InvariantCultureIgnoreCase) &&
                context.MethodInfo.GetParameters().Any(p => p.ParameterType == typeof(Customer)))
            {
                if (operation.RequestBody != null && operation.RequestBody.Content.ContainsKey("application/json"))
                {
                    operation.RequestBody.Content["application/json"].Example = GetCustomerPutRequestExample();
                }
            }
        }

  

        private OpenApiObject GetCustomerPutRequestExample()
        {
            return new OpenApiObject
            {
                ["id"] = new OpenApiInteger(123),
                ["name"] = new OpenApiString("Max Mustermann"),
                ["code"] = new OpenApiString("Code Muster"),
                ["responsiblePerson"] = new OpenApiString("Mustermann Max"),
                ["startDate"] = new OpenApiString("2024-09-08")
            };
        }

        private OpenApiObject GetCustomerPostRequestExample()
        {
            return new OpenApiObject
            {
                ["name"] = new OpenApiString("Max Mustermann"),
                ["code"] = new OpenApiString("Code Muster"),
                ["responsiblePerson"] = new OpenApiString("Mustermann Max"),
                ["startDate"] = new OpenApiString("2024-09-08")
            };
        }

        private OpenApiObject GetProjectRequestExample()
        {
            return new OpenApiObject
            {
                ["name"] = new OpenApiString("Max Mustermann"),
                ["description"] = new OpenApiString("Description"),
                ["startDate"] = new OpenApiString("2024-09-08"),
                ["endDate"] = new OpenApiString("2024-09-08"),
                ["responsiblePerson"] = new OpenApiString("Mustermann Max"),
                ["customerId"] = new OpenApiInteger(0)
            };
        }
    }
}
