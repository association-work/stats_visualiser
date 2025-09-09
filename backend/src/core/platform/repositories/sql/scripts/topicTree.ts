export const topicTreeRequest = `
select 
	_topic.*,  
	COALESCE(
		(
			SELECT json_agg
			(
				jsonb_build_array(
					_y.year,
					_loc.name,
					_val."value"
				)	
			) FROM "value" _val 
			inner join "year" _y on _y.id = _val."yearId"
			inner join "location" _loc on _loc.id = _val."locationId"

			where _val."topicId" = _topic.id
		),
		'[]'::json
	) values FROM 
	(
		select  _root.id, _root.name, _root."parentId", _root.unit, _root."externalId", 
			
			json_build_object(
				'name', _root."sourceName",
				'url', _root."sourceUrl"
			)  "source",
			COALESCE(json_agg(_child) FILTER (WHERE _child.id is not null), '[]') children from topic _root
		left join 
		(
			select _t.id, _t.name, _t."parentId", _t.unit, _t."externalId", 
				json_build_object(
					'name', _t."sourceName",
					'url', _t."sourceUrl"
				)  "source", 
				exists(select 1 from topic _c where _c."parentId" = _t.id) "hasChildren" from topic _t
		) _child on _child."parentId" = _root."id"
	
		group by _root.id
	) as _topic
`;
