export const topicTreeRequest = (location: string) => `
select 
	_topic.*,
	json_build_object(
		'name', _ds."sourceName",
		'url', _ds."sourceUrl"
	)  "source", 
	_ds.unit,
	COALESCE(
		(
			SELECT json_agg
			(
				jsonb_build_array(
					_y.year,
					_val."value"
				)	
			) FROM "value" _val 
			inner join "year" _y on _y.id = _val."yearId"
			inner join data_series _d on _d.id = _val."seriesId"

			where _d."topicId" = _topic.id and _d."locationId" = _ds."locationId"
		),
		'[]'::json
	) values FROM 
	(
		select  _root.id, _root.name, _root."parentId", _root."externalId", 
			COALESCE(json_agg(_child) FILTER (WHERE _child.id is not null), '[]') children 
		from topic _root

		left join
		(
			select _t.id, _t.name, _t."parentId", _d.unit, _t."externalId",  
				COALESCE(
					(
						SELECT json_agg
						(
							jsonb_build_array(
								_y.year,
								_val."value"
							)	
						) FROM "value" _val 
						inner join "year" _y on _y.id = _val."yearId"
						inner join data_series _ds on _d.id = _val."seriesId"

						where _ds."topicId" = _d."topicId" and _ds."locationId" = _d."locationId"
					),
					'[]'::json
				) values, 
				json_build_object(
					'name', _d."sourceName",
					'url', _d."sourceUrl"
				)  "source", 
				exists(select 1 from topic _c where _c."parentId" = _t.id) "hasChildren" 
				from topic _t
				inner join data_series _d on _d."topicId" = _t.id
				inner join "location" _l on _d."locationId" = _l.id
			where _l."name" = '${location}'
		) _child on _child."parentId" = _root."id"
	
		group by _root.id
	) as _topic
	INNER JOIN data_series _ds ON _ds."topicId" = _topic.id
	INNER JOIN "location" _loc ON _loc.id = _ds."locationId"
`;

export const locationTreeRequest = (topicId: string) => `
select 
	_location.*,  
	json_build_object(
		'name', _ds."sourceName",
		'url', _ds."sourceUrl"
	)  "source", 
	_ds.unit,
	_ds."topicId",
	COALESCE(
		(
			SELECT json_agg
			(
				jsonb_build_array(
					_y.year,
					_val."value"
				)	
			) FROM "value" _val 
			inner join "year" _y on _y.id = _val."yearId"
			inner join data_series _d on _ds.id = _val."seriesId"
			where _d."topicId" = _ds."topicId" and _d."locationId" = _location.id
		),
		'[]'::json
	) values FROM 
	(
		select  _root.id, _root.name, _root."parentId", _root."externalId", 
	
			COALESCE(json_agg(_child) FILTER (WHERE _child.id is not null), '[]') children 
		FROM "location" _root
		LEFT JOIN 
		(
			select _l.id, _l.name, _l."parentId", _d.unit, _l."externalId", _d."topicId",
				COALESCE(
					(
						SELECT json_agg
						(
							jsonb_build_array(
								_y.year,
								_val."value"
							)	
						) FROM "value" _val 
						inner join "year" _y on _y.id = _val."yearId"
						inner join data_series _ds on _d.id = _val."seriesId"

						where _ds."topicId" = _d."topicId" and _ds."locationId" = _d."locationId"
					),
					'[]'::json
				) values, 
				json_build_object(
					'name', _d."sourceName",
					'url', _d."sourceUrl"
				)  "source", 
				exists(select 1 from "location" _c where _c."parentId" = _l.id) "hasChildren" 
				from "location" _l
				inner join data_series _d on _d."locationId" = _l.id
				where _d."topicId" = '${topicId}'
		) _child on _child."parentId" = _root."id"
	
		group by _root.id
	) as _location 
INNER JOIN data_series _ds ON _ds."locationId" = _location.id
INNER JOIN topic _tp ON _tp.id = _ds."topicId"
`;
