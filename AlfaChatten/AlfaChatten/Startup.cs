using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AlfaChatten.Hubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AlfaChatten.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace AlfaChatten
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddAuthentication().AddFacebook(facebookOptions =>
            {
                facebookOptions.AppId = Configuration["Authentication:Facebook:AppId"];
                facebookOptions.AppSecret = Configuration["Authentication:Facebook:AppSecret"];
                
                // Copy to Secret manager

                //{
                //    "Authentication:Facebook:AppId": "204781766763827",
                //     "Authentication:Facebook:AppSecret": "e65b20a53c7c16dada2b33c0f3db7ea8"
                //}


                facebookOptions.Fields.Add("birthday");
                facebookOptions.Fields.Add("gender");
            });


            services.AddTransient<DataManager>();

            services.AddAuthentication();

            services.AddMvc();

            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseExceptionHandler("/error");

            }
            else
            {
                app.UseExceptionHandler("/error");
            }


            app.UseStaticFiles();

            // ÄNDRA EJ ORDNINGEN PÅ DESSA!
            app.UseAuthentication();

            app.UseSignalR(routes =>
            {
                routes.MapHub<ChatHub>("chat");
            });

            app.UseMvc();
        }
    }
}
