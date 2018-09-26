module JSDatepicker.templates {

    export const weeks: ITemplate<IDaysTemplateConfig> = {
        config: {
            name: "weeks",
            step: { unit: "M", count: 1 },
            headerFormat: "MMMM YYYY",
            showWeeknumbers: true
        },
        template: `
            <%
                function renderWeekCell(text) {
                    w(template.config.showWeeknumbers ?'<div class="t-item t-week">'+ text +'</div>' : '');
                }

                function renderWeekdays() {
                    renderWeekCell('w');

                    moment.weekdaysMin().forEach(function(f) {
                        w('<div class="t-item t-weekday">'+ f +'</div>');
                    });
                }
            %>
            <div class="t-days t-weeks">
                <div class="t-head">
                    <div class="t-week">
                    <%
                        renderWeekdays();
                    %>
                    </div>
                </div>
                <div class="t-body">
                <% 
                    var t = {
                        date: options.date,
                        end: moment(date).endOf("month").endOf("isoWeek"),
                        start: moment(date).startOf("month").startOf("isoWeek"),
                        week: null,
                        today: moment(),
                        current: null
                    };

                    t.current = moment(t.start);

                    while(t.current < t.end) {
                        if(t.week != t.current.isoWeek()) {
                            if(t.week) w('</div>');

                            w(t.current.isSame(options.date, "week") 
                                ? '<div class="t-week active">'
                                : '<div class="t-week">'
                            );

                            t.week = t.current.isoWeek();
                            renderWeekCell(t.week);
                        }
                        
                        var item = {
                            value: t.current.date(),
                            classes: ["t-item", "t-day"]
                        };

                        if(t.current.isSame(t.date, "day")) item.classes.push("active");
                        if(t.current.isSame(t.today, "day")) item.classes.push("t-today");
                        if(!t.current.isSame(date, "month")) item.classes.push("t-other");
                        w('<div class="<%=item.classes.join(" ")%>" data-date="<%=t.current.format('YYYY-MM-DD')%>"><%=item.value%></div>');
                        t.current.add(1, "d");
                    }
                %>
                </div>
            </div>`,
        onMounted: function (instance: DatePicker, element: JQuery) {
            const items = element.find(".t-body .t-day");

            items.on("click", (e) => {
                const target = $(e.target);
                const value = target.attr("data-date");
                instance.date = moment(value).startOf("isoWeek");
            });
        }
    }
}