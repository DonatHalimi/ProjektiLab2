using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FAQController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;

        public FAQController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
        }

        [HttpGet]
        public async Task<ActionResult<List<FAQ>>> Get()
        {
            try
            {
                var faqs = await _mongoDBService.GetAsync();
                return Ok(faqs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<FAQ>> Get(string id)
        {
            try
            {
                var faq = await _mongoDBService.GetAsync(id);
                if (faq == null)
                    return NotFound(new { message = "FAQ not found" });

                return Ok(faq);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] FAQ faq)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _mongoDBService.CreateAsync(faq);
                return CreatedAtAction(nameof(Get), new { id = faq.Id }, faq);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, [FromBody] FAQ faq)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var existingFAQ = await _mongoDBService.GetAsync(id);
                if (existingFAQ == null)
                    return NotFound(new { message = "FAQ not found" });

                await _mongoDBService.UpdateAsync(id, faq);
                return NoContent();
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
                var faq = await _mongoDBService.GetAsync(id);
                if (faq == null)
                    return NotFound(new { message = "FAQ not found" });

                await _mongoDBService.RemoveAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        public class DeleteFAQsRequest
        {
            public string[] Ids { get; set; }
        }

        [HttpPost("delete-bulk")]
        public async Task<IActionResult> DeleteBulk([FromBody] DeleteFAQsRequest request)
        {
            try
            {
                if (request?.Ids == null || request.Ids.Length == 0)
                {
                    return BadRequest(new { message = "No IDs provided for deletion" });
                }

                foreach (var id in request.Ids)
                {
                    await _mongoDBService.RemoveAsync(id);
                }
                
                return Ok(new { message = "FAQs deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
} 