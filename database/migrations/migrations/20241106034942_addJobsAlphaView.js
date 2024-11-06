/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
		create view v_job_alphabetical as
		SELECT
			j.event_id,
			COALESCE(pl.last_name, m.last_name) AS last_name,
			COALESCE(pl.first_name, m.first_name) AS first_name,
			IF(j.paid_labor_id IS NOT NULL, 'Paid', 'Member') AS person_type,
			j.job_type_id,
			jt.title
		FROM 
			job j
			INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id
			LEFT JOIN member m ON j.member_id = m.member_id
			LEFT JOIN paid_labor pl ON j.paid_labor_id = pl.paid_labor_id
		where 
			j.event_id is not null
		ORDER BY 
			j.event_id,
			COALESCE(pl.last_name, m.last_name) IS NULL,
			COALESCE(pl.last_name, m.last_name) ASC,
			COALESCE(pl.first_name, m.first_name) IS NULL,
			COALESCE(pl.first_name, m.first_name) ASC;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(
        `drop view v_job_alphabetical`
    );
};
