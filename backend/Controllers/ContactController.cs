using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ContactService _contactService;

        public ContactController(ContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Contact>>> Get()
        {
            try
            {
                var contacts = await _contactService.GetAsync();
                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Contact>> Get(string id)
        {
            try
            {
                var contact = await _contactService.GetAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact not found" });
                }
                return Ok(contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Contact contact)
        {
            try
            {
                await _contactService.CreateAsync(contact);
                return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        public class DeleteContactsRequest
        {
            public string[] Ids { get; set; }
        }

        [HttpPost("delete-bulk")]
        public async Task<IActionResult> DeleteBulk([FromBody] DeleteContactsRequest request)
        {
            try
            {
                if (request?.Ids == null || request.Ids.Length == 0)
                {
                    return BadRequest(new { message = "No IDs provided for deletion" });
                }

                await _contactService.RemoveManyAsync(request.Ids);
                return Ok(new { message = "Contacts deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var contact = await _contactService.GetAsync(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Contact not found" });
                }

                await _contactService.RemoveAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
} 